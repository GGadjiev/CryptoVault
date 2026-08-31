import {useWatchlistStore} from "@/features/watchlist";
import styles from './FavoriteButton.module.scss'


interface FavoriteButtonProps {
  coinId: string;
}

export const FavoriteButton = (props: FavoriteButtonProps) => {
  const { coinId } = props;

  const isFavorite = useWatchlistStore(s => s.ids.includes(coinId));
  const toggle = useWatchlistStore(s => s.toggle);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    toggle(coinId)
  }

  return (
    <button
      type='button'
      className={isFavorite ? styles.filled : styles.outline}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      ★
    </button>
  )
}