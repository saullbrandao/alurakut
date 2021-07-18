import styled from 'styled-components'

export const Box = styled.div`
  background: var(--backgroundTertiary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;

  .boxLink {
    font-size: 14px;
    color: var(--colorPrimary);
    text-decoration: none;
    font-weight: 800;
  }

  .listLink {
    font-size: 18px;
    color: var(--colorPrimary);
    text-decoration: none;
    font-weight: 400;
  }

  .communitiesNav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      display: flex;
      justify-content: space-between;
      color: var(--textPrimaryColor);
      font-size: 14px;
      margin-top: 16px;
      margin-bottom: 16px;

      a {
        margin-left: 4px;
        &:not(:last-child) {
          border-right: 1px solid var(--textPrimaryColor);
          padding-right: 4px;
        }
      }
    }
  }

  .communityInfo {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .communitiesList {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background: var(--backgroundSecondary);

    li:first-child {
      border-radius: 10px;
    }

    li:nth-child(odd) {
      background: var(--backgroundPrimary);
    }

    li {
      display: flex;
      align-items: center;
      gap: 20px;
      width: 100%;
      padding: 12px;
    }

    img {
      border-radius: 50%;
      height: 100px;
      width: 100px;
    }
  }

  .aboutList {
    display: flex;
    flex-direction: column;
    text-align: center;
    background: var(--backgroundPrimary);

    li:nth-child(even) {
      background: var(--backgroundSecondary);
    }

    li {
      display: flex;
      font-size: 14px;
      height: 38px;
      justify-content: center;
      align-items: center;
      color: var(--textTertiaryColor);
    }
  }

  .title {
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .subTitle {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .smallTitle {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 700;
    color: var(--textPrimaryColor);
    margin-bottom: 20px;
  }

  .smallSubTitle {
    font-size: 12px;
    color: var(--textTertiaryColor);
  }

  hr {
    margin-top: 12px;
    margin-bottom: 8px;
    border-color: transparent;
    border-bottom-color: #ecf2fa;
  }
  input {
    width: 100%;
    background-color: #f4f4f4;
    color: #333333;
    border: 0;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 10000px;
    ::placeholder {
      color: #333333;
      opacity: 1;
    }
  }
  button {
    border: 0;
    padding: 8px 12px;
    color: #ffffff;
    border-radius: 10000px;
    background-color: #6f92bb;
  }
`
