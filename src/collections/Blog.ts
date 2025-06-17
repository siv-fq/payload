import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import axios from 'axios'
import { Access } from 'payload'

const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

const isEditorOrAdmin: Access = ({ req: { user } }) => {
  const role = user?.role ?? ''
  return role === 'admin' || role === 'editor'
}

export const Blog: CollectionConfig = {
  slug: 'blog',
  versions: {
    drafts: {
      schedulePublish: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    preview: (doc) => {
      if (!doc?.slug) {
        return null
      }
      return `http://localhost:3001/blog/${doc.slug}`
    },
  },
  access: {
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({}),
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          await axios.post('http://localhost:3001/api/payload-revalidate', {
            entry: { slug: doc.slug, type: 'blog' },
          })
          console.log(`Successfully revalidated slug: ${doc.slug}`)
        } catch (err) {
          console.error('Error revalidating:', err)
        }
      },
    ],
  },
}
