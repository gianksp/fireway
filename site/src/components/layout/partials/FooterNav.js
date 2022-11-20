import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const FooterNav = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-nav',
    className
  );

  return (
    <nav
      {...props}
      className={classes}
    >
      <ul className="list-reset">
        <li>
          <Link to="https://twitter.com/gianksp">Contact</Link>
        </li>
        <li>
          <Link to="https://www.linkedin.com/in/gianksp/">About me</Link>
        </li>
        <li>
          <Link to="https://github.com/gianksp/fireway">FAQ's</Link>
        </li>
        <li>
          <Link to="https://discord.gg/CYYX8yUVgc">Support</Link>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;