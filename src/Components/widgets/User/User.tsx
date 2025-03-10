import { FC, useState } from 'react';
import { DropdownMenu, Text, Icon, Modal } from '@gravity-ui/uikit';
import { ArrowRightFromSquare } from '@gravity-ui/icons';
import { useTranslation } from 'react-i18next';

import { SettingsPanel } from '@/Components/widgets/User/components/SettingsPanel/SettingsPanel';
import { UserProps } from './interfaces';
import styles from './styles.module.css';

export const User: FC<UserProps> = (props) => {
  const { t } = useTranslation();
  const { username, onExit, onChangeSettings, userSettings } = props;

  const [isOpen, setIsOpen] = useState(false);

  const onSettingshandler = () => {
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu
        size="l"
        renderSwitcher={(props) => (
          <Text {...props} className={styles.userSwitcher}>
            {username}
          </Text>
        )}
        items={[
          {
            action: onSettingshandler,
            text: t('settings'),
            title: t('settings'),
          },
          {
            action: onExit,
            iconEnd: <Icon size={16} data={ArrowRightFromSquare} />,
            text: t('logout'),
            title: t('logout'),
          },
        ]}
      />
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <SettingsPanel
          onClose={onCloseHandler}
          onChangeSettings={onChangeSettings}
          userSettings={userSettings}
        />
      </Modal>
    </>
  );
};
