import Image from "next/image";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const inspirationalContent = [
  {
    type: "quote",
    content:
      "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
  },
  {
    type: "image",
    imageId: "inspire1",
  },
  {
    type: "image",
    imageId: "inspire2",
  },
  {
    type: "quote",
    content: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
    {
    type: "quote",
    content: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    type: "image",
    imageId: "inspire3",
  },
];

export default function InspirePage() {
  const getImage = (id: string) =>
    PlaceHolderImages.find((img) => img.id === id);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gradient-to-br from-black to-emerald-800 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirationalContent.map((item, index) => {
            if (item.type === "quote") {
              return (
                <Card
                  key={index}
                  className="flex flex-col justify-center items-center text-center p-6 bg-background/70"
                >
                  <CardContent className="p-0">
                    <blockquote className="text-xl font-semibold leading-snug">
                      &ldquo;{item.content}&rdquo;
                    </blockquote>
                    <p className="text-muted-foreground mt-4">- {item.author}</p>
                  </CardContent>
                </Card>
              );
            }
            if (item.type === "image") {
              const imageData = getImage(item.imageId);
              if (!imageData) return null;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={imageData.imageUrl}
                        alt={imageData.description}
                        fill
                        className="object-cover"
                        data-ai-hint={imageData.imageHint}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
