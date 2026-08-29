import type { CoinDetails } from "../../types";
import { CoinHeader } from "./CoinHeader";
import { StatsGrid } from "./StatsGrid";
import { DescriptionBlock } from "./DescriptionBlock";
import { ExternalLink } from "./ExternalLink";
import styles from './CoinDetails.module.scss'

interface CoinDetailsViewProps {
  details: CoinDetails;
}

export const CoinDetailsView = (props: CoinDetailsViewProps) => {
  const { details } = props;

  return (
    <div className={styles.content}>
      <CoinHeader details={details} />
      <StatsGrid details={details} />
      <DescriptionBlock text={details.description} />
      <ExternalLink homepageUrl={details.homepageUrl} />
    </div>
  )
}