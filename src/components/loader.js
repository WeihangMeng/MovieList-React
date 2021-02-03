import styled from "styled-components";

export default styled.div`
  position: relative;
  @keyframes spinner {
    from {
      /* transform: rotate(0deg); */
    }
    to {
      transform: rotate(360deg);
    }
  }

  :before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: rotate(0deg);
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #000;
    animation: spinner 0.6s linear infinite;
  }
`;
