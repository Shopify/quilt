import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Redirect as NetworkRedirect} from '@shopify/react-network';

interface Props {
  url: string;
}

function Redirect({url}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(url);
  }, [navigate, url]);
  return <NetworkRedirect url={url} />;
}

export default Redirect;
