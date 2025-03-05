import React from 'react'
import { 
    Carousel, 
    CarouselContent, 
    CarouselItem, 
    CarouselNext, 
    CarouselPrevious 
  } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";


const RecommendationSkeleton = () => {
    return (
      <Carousel>
        <CarouselContent className="-ml-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <CarouselItem 
              key={index} 
              className="pl-4 basis-[280px] shrink-0 grow-0"
            >
              <div className="space-y-4">
                <Skeleton className="w-full h-[420px] rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    );
  };

export default RecommendationSkeleton
