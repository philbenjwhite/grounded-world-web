import React from 'react';
import Container from '../../layout/Container';
import Text from '../../atoms/Text';

export interface FooterProps {
  /** Optional className for additional styling */
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        bg-[var(--comp-body-surface)]
        py-8
        ${className ?? ''}
      `}
    >
      <Container>
        <Text size="body-sm" color="tertiary">
          &copy; {currentYear} Grounded World
        </Text>
      </Container>
    </footer>
  );
};

export default Footer;
