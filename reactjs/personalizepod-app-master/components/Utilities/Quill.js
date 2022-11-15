import dynamic from 'next/dynamic'

const QuillEditor = dynamic(() => import('../../components/Utilities/Editor'), {
  ssr: false
})

export default () => <QuillEditor />
