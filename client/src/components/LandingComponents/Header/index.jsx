import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeaderWrapper,
  HeaderInner,
  LogoLink,
  LogoImg,
  LogoName,
  Nav,
  NavLink,
  HeaderActions,
  LoginLink,
  SignUpLink,
} from "./styles";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderWrapper
      as={motion.header}
      $scrolled={scrolled}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <HeaderInner>
        <LogoLink to="/">
          <LogoImg src="/KnowFlow-Logo.png" alt="KnowFlow" />
          <LogoName>KnowFlow</LogoName>
        </LogoLink>

        <Nav>
          {[
            { label: "Produto", href: "#features" },
            { label: "Planos", href: "#plans" },
            { label: "Comunidade", href: "#community" },
          ].map(({ label, href }) => (
            <NavLink key={label} href={href}>
              {label}
            </NavLink>
          ))}
        </Nav>

        <HeaderActions>
          <LoginLink to="/login">Entrar</LoginLink>
          <SignUpLink to="/cadastro">
            Começar grátis
            <ChevronRight size={13} strokeWidth={2.5} />
          </SignUpLink>
        </HeaderActions>
      </HeaderInner>
    </HeaderWrapper>
  );
}
