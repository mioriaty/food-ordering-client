/**
 * Tại sao sử dụng "as const"?
 *
 * 1. Khi không có "as const":
 *    - TypeScript sẽ suy luận kiểu dữ liệu rộng hơn (string)
 *    - Các giá trị có thể bị thay đổi
 *    Ví dụ: const Role = { Owner: 'Owner' }
 *    => TypeScript hiểu Role.Owner có kiểu là string
 *
 * 2. Khi có "as const":
 *    - TypeScript sẽ suy luận kiểu dữ liệu chính xác ("Owner")
 *    - Các giá trị là readonly, không thể thay đổi
 *    - Tạo ra union type chính xác khi kết hợp với typeof
 *    Ví dụ: const Role = { Owner: 'Owner' } as const
 *    => TypeScript hiểu Role.Owner có kiểu chính xác là "Owner"
 *
 * 3. Với mảng values:
 *    - Không có "as const": kiểu là string[]
 *    - Có "as const": kiểu là readonly ["Owner", "Employee", "Guest"]
 *    => Giúp tạo union type chính xác: type UserRole = typeof RoleValues[number]
 */

export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  TableToken: 'TableToken'
} as const;

export const Role = {
  Owner: 'Owner',
  Employee: 'Employee',
  Guest: 'Guest'
} as const;

export const RoleValues = [Role.Owner, Role.Employee, Role.Guest] as const;

export const DishStatus = {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Hidden: 'Hidden'
} as const;

export const DishStatusValues = [DishStatus.Available, DishStatus.Unavailable, DishStatus.Hidden] as const;

export const TableStatus = {
  Available: 'Available',
  Hidden: 'Hidden',
  Reserved: 'Reserved'
} as const;

export const TableStatusValues = [TableStatus.Available, TableStatus.Hidden, TableStatus.Reserved] as const;

export const OrderStatus = {
  Pending: 'Pending',
  Processing: 'Processing',
  Rejected: 'Rejected',
  Delivered: 'Delivered',
  Paid: 'Paid'
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid
] as const;

export const ManagerRoom = 'manager' as const;
