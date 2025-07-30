"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  type DragEndEvent,
  type DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import type { AdminSingleCourseOutput } from "@/utils/server-types";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Grip,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { NewChapterModal } from "./new-chapter-modal";
import { NewLessonModal } from "./new-lesson-modal";
import { DeleteLesson } from "./delete-lesson";
import { DeleteChapter } from "./delete-chapter";
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

type SortableItemType = {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
};
export const CourseStructure = ({
  data,
}: {
  data: AdminSingleCourseOutput;
}) => {
  const { mutate: reorderChapters } = useMutation(
    trpc.chapter.reorderChapters.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getAdminSingleCourse.queryKey({
            courseId: data.id,
          }),
        });
      },
    })
  );
  const { mutate: reorderLessons } = useMutation(
    trpc.lesson.reorderLessons.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getAdminSingleCourse.queryKey({
            courseId: data.id,
          }),
        });
      },
    })
  );

  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        data.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen:
            prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];
      return updatedItems;
    });
  }, [data]);

  function SortableItem({ children, id, className, data }: SortableItemType) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = active.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Failed to move chapter");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Failed to move chapter");
        return;
      }

      const reporderLocalChapters = arrayMove(items, oldIndex, newIndex);
      const updatedChapterForState = reporderLocalChapters.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const prevItems = [...items];
      setItems(updatedChapterForState);

      if (courseId) {
        const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));
        reorderChapters(
          { courseId, chapters: chaptersToUpdate },
          {
            onSuccess: () => {
              toast.success("Chapters reordered successfully");
            },
            onError: () => {
              toast.error("Failed to reorder chapters");
              setItems(prevItems);
            },
          }
        );
      }
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId ?? null;
      const overChapterId = over.data.current?.chapterId ?? null;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error("Can't move lesson to different chapter");
        return;
      }

      const chapterIndex = items.findIndex((item) => item.id === chapterId);
      if (chapterIndex === -1) {
        toast.error("Failed to move lesson");
        return;
      }

      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Failed to move lesson");
        return;
      }

      const reporderLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );
      const updatedLessonForState = reporderLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };
      const prevItems = [...items];
      setItems(newItems);

      if (courseId) {
        const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        reorderLessons(
          {
            courseId,
            lessons: lessonsToUpdate,
            chapterId,
          },
          {
            onSuccess: () => {
              toast.success("Lessons reordered successfully");
            },
            onError: () => {
              toast.error("Failed to reorder lessons");
              setItems(prevItems);
            },
          }
        );
      }

      return;
    }
  }

  const toggleChapter = (chapterId: string) => {
    setItems((chapters) => {
      return chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            isOpen: !chapter.isOpen,
          };
        }
        return chapter;
      });
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>
        <CardContent className="space-y-4">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter", chapterId: item.id }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => {
                        toggleChapter(item.id);
                      }}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-grab "
                            {...listeners}
                          >
                            <GripVertical className="size-4 " />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex items-center "
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapter chapterId={item.id} courseId={data.id} />
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={item.lessons.map((lesson) => lesson.id)}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex group items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...lessonListeners}
                                      >
                                        <Grip className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson
                                      lessonId={lesson.id}
                                      chapterId={item.id}
                                      courseId={data.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal
                              courseId={data.id}
                              chapterId={item.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};
