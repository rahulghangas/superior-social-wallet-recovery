import React, { Suspense } from 'react'

import Bridge from 'pages/bridge'

import styled from 'styled-components';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from '../theme';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  z-index: 4;
  height: 86px;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 60px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const App: React.FC = () => {
  const appTheme = theme(true);
	return (
		<Suspense fallback={null}>
			<SkeletonTheme baseColor={appTheme.bg3} highlightColor={appTheme.bg2}>
				<AppWrapper>
					<BodyWrapper>
            <ToastContainer
                draggable={false}
                className="custom-toast-root"
                toastClassName="custom-toast-container"
                bodyClassName="custom-toast-body"
                position="top-right"
                transition={Slide}
            />
						<Bridge/>
						<Marginer/>	
					</BodyWrapper>
				</AppWrapper>
			</SkeletonTheme>
		</Suspense>
	)
}
export default App;