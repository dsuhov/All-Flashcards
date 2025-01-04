import { Flex, Box, Text } from '@gravity-ui/uikit';

import { UserSettings } from '@/types/user';
import { Link } from '@/Components/Link';
import { User } from '@/Components/User';
import styles from './styles.module.css';

export const Header = () => {
  const onChangeSettings = async (data: UserSettings) => {
    const end = await new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, 1000);
    });

    return end;
  };

  return (
    <Box as="header" spacing={{ p: 2, mb: 3 }} className={styles.header}>
      <Flex>
        <Link href="/" title="home">
          <Text variant="header-1">F-Cards</Text>
        </Link>
        <Flex justifyContent="right" alignItems="center" grow={1}>
          <Text variant="body-1">
            <User
              onExit={() => alert('Exit clicked')}
              username="Демидрол Суходрищев"
              onChangeSettings={onChangeSettings}
              userSettings={{
                language: 'rus',
                studySessionCards: 5,
                theme: 'light',
              }}
            />
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
