import React, { useState } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /* added */
  height: 400px;
`;

const CarouselImg = styled.img`
  width: 500px;
  height: 500px;
  object-fit: cover;
  /* Media query for screens with a maximum width of 414px */
  @media (max-width: 414px) {
    width: 340px;
    height: 340px;
    margin-left:-20px
  }
`;


const ArrowWrapper = styled.div` /* added */
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ArrowButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #0B486A;
  font-size: 2rem;
  &:hover {
    color: #FF7D00;
  }
  ${(props) => props.left ? `
    margin-right: 10px; /* modified */
  ` : `
    margin-left: 10px; /* modified */
  `}
`;

const ProductCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLeftArrowClick = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(images.length - 1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleRightArrowClick = () => {
    if (currentImageIndex === images.length - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <CarouselContainer>
      <CarouselImg src={images[currentImageIndex]} alt="Product Image" />
      <ArrowWrapper> {/* added */}
        <ArrowButton onClick={handleLeftArrowClick} left>{'<'}</ArrowButton>
        <ArrowButton onClick={handleRightArrowClick}>{'>'}</ArrowButton>
      </ArrowWrapper>
    </CarouselContainer>
  );
};

export default ProductCarousel;