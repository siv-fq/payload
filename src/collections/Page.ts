import { CollectionConfig } from 'payload'
import { HeroBlock } from './Block'

export const Page: CollectionConfig = {
  slug: 'pages',
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
      name: 'blocks',
      type: 'blocks',
      blocks: [HeroBlock],
    },
  ],
}
