import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const AnimeCard = ({ anime }) => {
  if (!anime) return null;

  return (
    <Card className="rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardMedia
        component="img"
        height="250"
        image={anime.images?.jpg?.image_url || "/placeholder.jpg"}
        alt={anime.title}
        className="object-cover"
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" noWrap>
          {anime.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {anime.episodes ? `${anime.episodes} Episodes` : "Unknown Episodes"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
