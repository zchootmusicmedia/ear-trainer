import React from 'react';

const LOGO_URL =
  'https://images.ravpages.co.il/xsite_resources/user_content/cp_new_production/2b/ec/56/73/2bec5673753ae4bf3c4ab71a9e284fcf/images/deed61ced943b492e51a3822ea032471.png?maxWidth=400';

export default function Logo() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14px', paddingBottom: '6px' }}>
      <img
        src={LOGO_URL}
        alt="לנגן משמיעה"
        style={{ maxWidth: 'min(180px, 38vw)', width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
