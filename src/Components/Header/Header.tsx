import { Flex, Box, Text } from '@gravity-ui/uikit';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '@/firebase.config';
import { toaster } from '@/shared/toaster';

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
      }, 500);
    });

    return end;
  };

  const onExithandler = () => {
    try {
      signOut(firebaseAuth);
    } catch (err) {
      if (err instanceof Error) {
        toaster.add({
          name: 'common error',
          title: err.message,
          content: 'sfd',
          theme: 'danger',
          autoHiding: 5000,
          isClosable: false,
        });
      }
    }
  };

  return (
    <Box as="header" spacing={{ p: 2, mb: 3 }} className={styles.headder}>
      <Flex>
        <Link href="/" title="home">
          <Text variant="header-1">F-Cards</Text>
        </Link>
        <Flex justifyContent="right" alignItems="center" grow={1}>
          <Text variant="body-1">
            <User
              onExit={onExithandler}
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
