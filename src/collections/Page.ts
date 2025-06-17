import { CollectionConfig } from 'payload'
import { HeroBlock } from './Block'
import axios from 'axios'
import { Access } from 'payload'

const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

const isEditorOrAdmin: Access = ({ req: { user } }) => {
  const role = user?.role ?? ''
  return role === 'admin' || role === 'editor'
}

export const Page: CollectionConfig = {
  slug: 'page',
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
      return `http://localhost:3001/${doc.slug}`
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
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [HeroBlock],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          await axios.post('http://localhost:3001/api/payload-revalidate', {
            entry: { slug: doc.slug, type: 'page' },
          })
          console.log(`Successfully revalidated slug: ${doc.slug}`)
        } catch (err) {
          console.error('Error revalidating:', err)
        }
      },
    ],
  },
}
