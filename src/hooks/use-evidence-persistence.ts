"use client"

import { useState, useEffect } from 'react'
import { get, set, del } from 'idb-keyval'

export function useEvidencePersistence(token: string) {
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null)
  
  const STORAGE_KEY = `evidence_draft_${token}`

  // Load draft on mount
  useEffect(() => {
    async function loadDraft() {
        try {
            const saved = await get(STORAGE_KEY)
            if (saved) {
                console.log('Restored draft from IDB')
                setDraftPhoto(saved)
            }
        } catch (error) {
            console.error('Failed to load draft:', error)
        }
    }
    loadDraft()
  }, [STORAGE_KEY])

  // Save draft
  const saveDraft = async (base64Data: string) => {
      try {
          await set(STORAGE_KEY, base64Data)
          setDraftPhoto(base64Data)
      } catch (error) {
          console.error('Failed to save draft:', error)
      }
  }

  // Clear draft
  const clearDraft = async () => {
      try {
          await del(STORAGE_KEY)
          setDraftPhoto(null)
      } catch (error) {
          console.error('Failed to clear draft:', error)
      }
  }

  return {
      draftPhoto,
      saveDraft,
      clearDraft
  }
}
