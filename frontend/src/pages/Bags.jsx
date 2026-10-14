import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import BagSection from '../components/BagSection';
import Tape from '../components/Tape';
import { getProduct } from '../redux/productSlice';

const Bags = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct({ status: 'approved' }));
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-20">
      <BagSection />
    </main>
  );
};

export default Bags;
