import { Flex } from '@gravity-ui/uikit';
import { ItemsScrollContainerProps } from './interfaces';
import styles from './styles.module.css';

export const ItemsScrollContainer = ({ items }: ItemsScrollContainerProps) => (
  <Flex direction="column" gap={2} className={styles.scrollContainer}>
    {items}
  </Flex>
);
