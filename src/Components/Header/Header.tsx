import { Flex, Box, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <Box as="header" spacing={{ p: 2 }} className={styles.header}>
      <Flex justifyContent="right">
        <Text variant="body-1">User</Text>
      </Flex>
    </Box>
  );
};
