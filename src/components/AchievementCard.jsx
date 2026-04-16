import styles from './AchievementCard.module.css';

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  );
}

const ICONS = {
  flame: FlameIcon,
  dumbbell: DumbbellIcon,
  bolt: BoltIcon,
};

export default function AchievementCard({ user }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.sectionLabel}>Achievements</p>

        <div className={styles.badges}>
          {user.achievements.map((achievement) => {
            const Icon = ICONS[achievement.icon] || BoltIcon;
            return (
              <div key={achievement.id} className={styles.badge}>
                <div className={`${styles.badgeIcon} ${styles[achievement.type]}`}>
                  <Icon />
                </div>
                <div className={styles.badgeValue}>{achievement.value}</div>
                <div className={styles.badgeUnit}>{achievement.unit}</div>
                <div className={styles.badgeLabel}>{achievement.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.peel} />
    </div>
  );
}
