// Server component - doesn't need 'use client' directive
import EditArticleForm from './EditArticleForm';

// This is the server component that receives the params and passes them to the client component
export default function EditArticlePage({ params }: { params: { id: string } }) {
  return <EditArticleForm articleId={params.id} />;
}