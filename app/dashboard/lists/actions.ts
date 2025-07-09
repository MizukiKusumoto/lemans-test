'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/utils/db/db'
import { companyLists, companies } from '@/utils/db/schema'
import { createClient } from '@/utils/supabase/server'

async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function createCompanyList(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証されていません')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const companiesData = formData.get('companies') as string

  if (!name || !companiesData) {
    throw new Error('必須項目が入力されていません')
  }

  try {
    // リストを作成
    const [list] = await db.insert(companyLists).values({
      name,
      description,
      userId: user.id,
    }).returning()

    // 企業データをパース
    const companiesArray = JSON.parse(companiesData)
    
    // 企業を追加
    if (companiesArray.length > 0) {
      await db.insert(companies).values(
        companiesArray.map((company: any) => ({
          ...company,
          listId: list.id,
          userId: user.id,
        }))
      )
    }

    revalidatePath('/dashboard/lists')
    redirect(`/dashboard/lists/${list.id}`)
  } catch (error) {
    console.error('リスト作成エラー:', error)
    throw new Error('リストの作成に失敗しました')
  }
}