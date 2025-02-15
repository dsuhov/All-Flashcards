import {
  Button,
  Modal,
  Box,
  Icon,
  Flex,
  Text,
  Card,
  Divider,
} from '@gravity-ui/uikit';
import cn from 'classnames';
import { CircleCheckFill } from '@gravity-ui/icons';
import { useTranslation } from 'react-i18next';

import { ConfirmLearnModalProps } from './interfaces';
import styles from './styles.module.css';

export const ConfirmLearnModal = (props: ConfirmLearnModalProps) => {
  const { open, onClose, toLearnQuantity, onLearnMore, onToDecks, ...rest } =
    props;

  const { t } = useTranslation();

  return (
    <Modal disableOutsideClick {...rest} open={open} onClose={onClose}>
      <Box spacing={{ p: 2 }}>
        <Card spacing={{ p: 4 }}>
          <Flex spacing={{ mb: 2, py: 4 }} justifyContent="center">
            <Icon data={CircleCheckFill} size={50} className={styles.okIcon} />
          </Flex>
          <Box spacing={{ mb: 2 }}>
            <Text variant="subheader-2" className={styles.centerText} as="div">
              {t('learnEntries.messageAlllearned')}
            </Text>
          </Box>
          <Box spacing={{ mb: 2 }}>
            <Divider />
          </Box>
          <Flex
            gap={4}
            className={cn({ [styles.btnLine]: toLearnQuantity > 0 })}
            justifyContent="center"
          >
            <Button view="outlined" onClick={onToDecks}>
              {t('learnEntries.return')}
            </Button>
            {toLearnQuantity > 0 && (
              <Button view="outlined" onClick={onLearnMore}>
                {t('learnEntries.learnAgain')} {toLearnQuantity}
              </Button>
            )}
          </Flex>
        </Card>
      </Box>
    </Modal>
  );
};
