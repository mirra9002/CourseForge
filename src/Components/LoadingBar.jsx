
import { useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, trickleSpeed: 120 });

export default function LoadingBar() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return null;
}
