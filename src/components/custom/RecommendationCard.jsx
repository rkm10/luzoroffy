import React from 'react'
import { Button } from "@/components/ui/button";
import { Bookmark, PlusIcon } from "lucide-react";

const RecommendationCard = ({ item, type, imageUrl }) => {
    return (
        <div className="relative group">
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-lg font-semibold line-clamp-2 mb-2">
                    {item.title}
                </h2>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span>{item.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                        >
                            <Bookmark className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {item.type && (
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {item.type}
                </div>
            )}
        </div>
    );
};

export default RecommendationCard
