import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const MangaCard = ({ manga }) => {
  if (!manga) return null;

  return (
    <Card className="rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardMedia
        component="img"
        height="250"
        image={manga.images?.jpg?.image_url || "/placeholder.jpg"}
        alt={manga.title}
        className="object-cover"
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" noWrap>
          {manga.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {manga.chapters ? `${manga.chapters} Chapters` : "Unknown Chapters"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MangaCard;
