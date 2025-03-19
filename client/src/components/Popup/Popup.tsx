import { Box, Typography } from "@mui/material";
import styles from "./Popup.module.css";

type PopupProps = {
  title: string;
  details: {
    label: string;
    value: string;
  }[];
  measurements?: {
    title: string;
    items: {
      label: string;
      value: string;
    }[];
  };
  position?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
};

function Popup({
  title,
  details,
  measurements,
  position = { top: 20, right: 20 },
}: PopupProps) {
  return (
    <Box className={styles.popup} sx={position}>
      <Typography className={styles.popupTitle}>{title}</Typography>

      {details.map((detail, index) => (
        <div key={index} className={styles.popupText}>
          <span className={styles.label}>{detail.label}:</span>
          <span className={styles.value}>{detail.value}</span>
        </div>
      ))}

      {measurements && (
        <div className={styles.measurementSection}>
          <Typography className={styles.measurementSectionTitle}>
            {measurements.title}
          </Typography>
          {measurements.items.map((item, index) => (
            <div key={index} className={styles.measurementItem}>
              <span className={styles.measurementLabel}>{item.label}</span>
              <span className={styles.measurementValue}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}

export default Popup;
