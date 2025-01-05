import { FC, MouseEvent } from 'react';
import { Link as UiLink, LinkProps } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';

export const Link: FC<LinkProps> = (props) => {
  const navigate = useNavigate();

  const onClickHandler = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    navigate(props.href);
  };

  return <UiLink {...props} onClick={onClickHandler} />;
};
