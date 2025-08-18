
import { useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function LoadingBar() {
  const navigation = useNavigation();

  // useEffect(() => {
  //   if (navigation.state === "loading") {
  //     NProgress.start();
  //   } else {
  //     NProgress.done();
  //   }
  // }, [navigation.state]);

  return null;
}
