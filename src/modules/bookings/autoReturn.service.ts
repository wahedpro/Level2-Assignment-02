import { pool } from "../../database/db";

export const autoReturnExpiredBookings = async () => {
  // Find all expired active bookings
  const result = await pool.query(
    `
      SELECT id, vehicle_id 
      FROM bookings
      WHERE rent_end_date < NOW() AND status = 'active'
    `
  );

  const rows = result.rows;

  for (const booking of rows) {
    // 1) Update booking → returned
    await pool.query(
      `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
      `,
      [booking.id]
    );

    // 2) Update vehicle → available
    await pool.query(
      `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
      `,
      [booking.vehicle_id]
    );
  }

  if (rows.length > 0) {
    console.log(`Auto-return processed: ${rows.length} bookings updated`);
  }
};