import lessons from "@/data/lessons.json";
import { notFound } from "next/navigation";
import LessonContent from "./LessonContent";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;

  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return notFound();

  const subtopics = lesson.coreConcepts.map((c) => ({
    id: c.toLowerCase().replace(/\s+/g, "-"),
    title: c,
  }));

  return (
  <LessonContent
    title={lesson.title}
    description={lesson.description}
    subtopics={subtopics}
    quiz={lesson.quiz}
    level={lesson.level}
  />
);

}
