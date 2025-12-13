import { BOOKING_STATUS } from "../bookings/bookings.interfaces";
import { Bookings } from "../bookings/bookings.model";
import { PAYMENT_STATUS } from "./payment.interfaces";
import { Payment } from "./payment.model";
import { Event } from '../event/event.model';

const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );


    const updatedBookingsInfo =await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    );

    const eventInfo = await Event.findById(updatedBookingsInfo?.event)

    const newTotalNumberOfBooking = eventInfo.total_no_of_booking + updatedBookingsInfo.guestCount

    await Event.findByIdAndUpdate(updatedBookingsInfo?.event, {total_no_of_booking: newTotalNumberOfBooking})

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment successfully completed.",
      data: {
        transitionId: updatedPaymentInfo?.transactionId,
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session }
    );

    await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.CANCEL },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment canceled",
      data: {
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment failed",
      data: {
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

export const paymentServices = {
  successPayment,
  cancelPayment,
  failedPayment,
};
