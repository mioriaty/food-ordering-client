import Script from 'next/script';

export const GoogleTag = () => {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HR9NYSP061" />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HR9NYSP061');
          `
        }}
      ></Script>
    </>
  );
};
