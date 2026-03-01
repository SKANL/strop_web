"use server"

import { revalidatePath } from "next/cache"

/**
 * Upload a photo for an incident to Supabase Storage and insert
 * a record into the `incident_photos` table.
 *
 * Expects FormData with:
 *   - file       : File   (the image)
 *   - incident_id: string
 *   - photo_type : "PROBLEM" | "SOLUTION" | "GENERAL"
 */
export async function uploadIncidentPhotoAction(
  formData: FormData
): Promise<{ success: boolean; photoUrl?: string; message?: string }> {
  try {
    const file = formData.get("file") as File | null
    const incidentId = formData.get("incident_id") as string | null
    const photoType = (formData.get("photo_type") as string) || "PROBLEM"

    if (!file || !incidentId) {
      return { success: false, message: "Faltan parámetros requeridos (file, incident_id)." }
    }

    // Convert File → ArrayBuffer → Buffer for Supabase storage upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `incidents/${incidentId}/${photoType.toLowerCase()}_${Date.now()}.${ext}`

    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Verify the user is authenticated before uploading
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: "No autorizado." }
    }

    // Upload to Storage bucket "incident-photos"
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("incident-photos")
      .upload(fileName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      })

    if (uploadError) {
      console.error("[storage] Upload error:", uploadError)
      return { success: false, message: "Error al subir la imagen. Intenta de nuevo." }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("incident-photos").getPublicUrl(uploadData.path)

    // Insert row into incident_photos
    const { error: insertError } = await supabase.from("incident_photos").insert({
      incident_id: incidentId,
      photo_url: publicUrl,
      photo_type: photoType,
      uploaded_by: user.id,
    })

    if (insertError) {
      console.error("[storage] incident_photos insert error:", insertError)
      // Return success with URL anyway — the photo is in Storage, just not linked in DB
      return { success: true, photoUrl: publicUrl }
    }

    revalidatePath(`/dashboard/incidents`)

    return { success: true, photoUrl: publicUrl }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al subir foto."
    console.error("[storage] uploadIncidentPhotoAction error:", message)
    return { success: false, message }
  }
}
