import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// Animations
const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components with Pink Theme (#C06FA2)

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '70px'};
  /* Rose Pink Gradient matching global theme */
  background: linear-gradient(180deg, #9B4F7E 0%, #C06FA2 100%);
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  box-shadow: 4px 0 24px rgba(192, 111, 162, 0.15);
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    width: ${props => props.isOpen ? '260px' : '70px'};
  }

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '100%' : '0px'};
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${props => props.isOpen ? slideInLeft : 'none'} 0.5s ease-out;

  span {
    letter-spacing: 0.5px;
  }
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const Navigation = styled.nav`
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0 0 12px 0;
  padding: 0 24px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin: 4px 12px;
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: ${props => props.active ? '24px' : '0'};
    background: #E08BB8;
    border-radius: 0 4px 4px 0;
    transition: all 0.2s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`;

const NavIcon = styled.div`
  font-size: 1.2rem;
  margin-right: ${props => props.isOpen ? '16px' : '0'};
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: margin 0.3s ease;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavText = styled.span`
  font-size: 0.95rem;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  flex: 1;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(26, 32, 44, 0.5);
  z-index: 999;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);

  @media (min-width: 769px) { display: none; }
`;

const MainContent = styled.div`

  margin-left: ${props => props.sidebarOpen ? '280px' : '70px'};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  position: relative;

  @media (max-width: 1200px) {
    margin-left: ${props => props.sidebarOpen ? '260px' : '70px'};
  }
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MobileMenuButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(192, 111, 162, 0.3);
  transition: all 0.2s ease;

  &:hover { 
    transform: scale(1.05); 
    box-shadow: 0 6px 16px rgba(192, 111, 162, 0.4);
  }
  @media (min-width: 769px) { display: none; }
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 20px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: #EF4444;
    border-color: #EF4444;
    transform: translateY(-2px);
    
    div, span { color: white; }
  }
`;

const LogoutIcon = styled.div`
  font-size: 1.2rem;
  margin-right: ${props => props.isOpen ? '16px' : '0'};
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EF4444; 
  transition: color 0.2s ease;
`;

const LogoutText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  color: #EF4444;
`;

// Component Logic

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
  localStorage.clear();

  const redirectUrl = process.env.REACT_APP_LOGIN_REDIRECT_URL;

  if (redirectUrl) {
    window.location.href = redirectUrl;   // <-- Redirect to external URL
  } else {
    navigate('/Login'); // fallback if env missing
  }

  if (isMobile) {
    setIsOpen(false);
  }
};

  const userRole = localStorage.getItem("role");
  
 const navigationItems = [];

if (userRole === "ER Admin") {
  navigationItems.push(
    {
      section: 'Main',
      items: [
        { path: '/AccountSummary', icon: '🧾', text: 'Account Summary' }
      ]
    },
    
  );
} 
else if (userRole === "ER Nurse") {
  navigationItems.push({
    section: 'Emergency Department',
    items: [
      { path: '/ERBilling', icon: '💰', text: 'ER Billing' },
      { path: '/PrintBill', icon: '🖨️', text: 'Print Bill' },   // FIXED!
    ]
  });
} 
else if (userRole === "ER Pharmacy") {
  navigationItems.push({
    section: 'Department',
    items: [
      { path: '/Pharmacy', icon: '💊', text: 'Pharmacy' }
    ]
  });
}

  return (
    <>
      {isMobile && (
        <MobileMenuButton onClick={toggleSidebar}>
          ☰
        </MobileMenuButton>
      )}
      
      <Overlay show={isMobile && isOpen} onClick={toggleSidebar} />
      
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo isOpen={isOpen}>
            {isOpen && <span>Emergency Room</span>}
          </Logo>
          <ToggleButton onClick={toggleSidebar}>
            {isOpen ? '←' : '→'}
          </ToggleButton>
        </SidebarHeader>

        <Navigation>
          {navigationItems.map((section, sectionIndex) => (
            <NavSection key={sectionIndex}>
              <NavSectionTitle isOpen={isOpen}>
                {section.section}
              </NavSectionTitle>
              {section.items.map((item, itemIndex) => (
                <NavItem
                  key={itemIndex}
                  active={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <NavIcon isOpen={isOpen}>
                    {item.icon}
                  </NavIcon>
                  <NavText isOpen={isOpen}>
                    {item.text}
                  </NavText>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Navigation>

        <LogoutButton onClick={handleLogout}>
          <LogoutIcon isOpen={isOpen}>
            🚪
          </LogoutIcon>
          <LogoutText isOpen={isOpen}>
            Logout
          </LogoutText>
        </LogoutButton>
      </SidebarContainer>
      
      <MainContent sidebarOpen={isOpen && !isMobile}>
        {children}
      </MainContent>
    </>
  );
};

export default Sidebar;