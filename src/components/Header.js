import React from 'react';

export default () => 
    <nav>
        <a className='pad6 flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3 is-active' href='#'>
            <svg className='icon mr3'><use xlinkHref='#icon-home'/></svg> Home
        </a>
        <a className='flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3' href='#'>
            <svg className='icon mr3'><use xlinkHref='#icon-user'/></svg> Account
  </a>
        <a className='flex-parent-inline btn color-blue color-white-on-active bg-transparent bg-darken5-on-hover bg-blue-on-active txt-s ml3' href='#'>
            <svg className='icon mr3'><use xlinkHref='#icon-logout'/></svg> Logout
  </a>
    </nav>