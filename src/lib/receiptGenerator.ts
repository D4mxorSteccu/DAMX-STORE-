// Receipt Generator for Telegram Bot
import { Order } from '../types';

export const generateReceiptImage = async (order: Order): Promise<string> => {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Canvas size
  const width = 400;
  const height = 700;
  canvas.width = width;
  canvas.height = height;
  
  // Background
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, width, height);
  
  // Header background
  const gradient = ctx.createLinearGradient(0, 0, width, 120);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(1, '#0d0d0d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 120);
  
  // Gold accent line
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 120, width, 3);
  
  // Logo text
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('DAMX STORE', width / 2, 45);
  
  // Tagline
  ctx.fillStyle = '#888888';
  ctx.font = '12px Arial';
  ctx.fillText('Trusted Digital Marketplace', width / 2, 70);
  
  // Order badge
  ctx.fillStyle = '#d4af37';
  roundRect(ctx, width / 2 - 60, 85, 120, 25, 12);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px Arial';
  ctx.fillText(`ORDER #${order.id.slice(0, 8).toUpperCase()}`, width / 2, 102);
  
  // Section: Order Info
  let yPos = 150;
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('ORDER DETAILS', 25, yPos);
  
  yPos += 25;
  ctx.fillStyle = '#888888';
  ctx.font = '12px Arial';
  ctx.fillText('Customer:', 25, yPos);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText(order.username, width - 25, yPos);
  
  yPos += 20;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#888888';
  ctx.fillText('WhatsApp:', 25, yPos);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText(order.whatsapp, width - 25, yPos);
  
  yPos += 20;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#888888';
  ctx.fillText('Date:', 25, yPos);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText(new Date(order.createdAt).toLocaleString('en-MY', { 
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), width - 25, yPos);
  
  // Divider
  yPos += 20;
  ctx.strokeStyle = '#333333';
  ctx.beginPath();
  ctx.moveTo(25, yPos);
  ctx.lineTo(width - 25, yPos);
  ctx.stroke();
  
  // Section: Items
  yPos += 25;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('ITEMS', 25, yPos);
  
  yPos += 20;
  order.items.forEach((item, index) => {
    // Item name
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    const itemName = item.product.name.length > 30 
      ? item.product.name.substring(0, 30) + '...' 
      : item.product.name;
    ctx.fillText(`${index + 1}. ${itemName}`, 25, yPos);
    
    // Quantity and price
    yPos += 18;
    ctx.fillStyle = '#888888';
    ctx.font = '11px Arial';
    ctx.fillText(`   Qty: ${item.quantity} × $${item.product.price.toFixed(2)}`, 25, yPos);
    
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'right';
    ctx.font = 'bold 13px Arial';
    ctx.fillText(`$${(item.product.price * item.quantity).toFixed(2)}`, width - 25, yPos);
    
    yPos += 25;
  });
  
  // Divider
  ctx.strokeStyle = '#333333';
  ctx.beginPath();
  ctx.moveTo(25, yPos);
  ctx.lineTo(width - 25, yPos);
  ctx.stroke();
  
  // Total
  yPos += 25;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('TOTAL', 25, yPos);
  
  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'right';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`$${order.total.toFixed(2)}`, width - 25, yPos);
  
  // Status badge
  yPos += 35;
  const statusColor = order.status === 'pending' ? '#f59e0b' : 
                      order.status === 'approved' ? '#22c55e' : '#ef4444';
  ctx.fillStyle = statusColor + '20';
  roundRect(ctx, width / 2 - 50, yPos - 15, 100, 30, 8);
  ctx.fill();
  ctx.fillStyle = statusColor;
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(order.status.toUpperCase(), width / 2, yPos + 5);
  
  // Footer
  yPos += 50;
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.moveTo(25, yPos);
  ctx.lineTo(width - 25, yPos);
  ctx.stroke();
  
  yPos += 25;
  ctx.fillStyle = '#666666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for your order!', width / 2, yPos);
  
  yPos += 20;
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('DAMX STORE', width / 2, yPos);
  
  yPos += 18;
  ctx.fillStyle = '#555555';
  ctx.font = '10px Arial';
  ctx.fillText('@D4mxorx | +60 11-3053 8675', width / 2, yPos);
  
  // Convert to base64
  return canvas.toDataURL('image/png');
}

// Helper function for rounded rectangles
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generate receipt with receipt image
export const generateReceiptForTelegram = async (order: Order): Promise<{ message: string; receiptImage: string }> => {
  const items = order.items.map(item => 
    `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const message = `
🛒 *NEW ORDER - DAMX STORE*

📋 *Order ID:* #${order.id}
👤 *Customer:* ${order.username}
📱 *WhatsApp:* ${order.whatsapp}
💰 *Total:* $${order.total.toFixed(2)}

📦 *Items:*
${items}

⏰ *Time:* ${new Date(order.createdAt).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}

⚡ *Status:* ${order.status.toUpperCase()}

_Review and approve in admin dashboard_
  `.trim();
  
  // Generate receipt image
  let receiptImage = '';
  try {
    receiptImage = await generateReceiptImage(order);
  } catch (e) {
    console.error('Failed to generate receipt image:', e);
  }
  
  return { message, receiptImage };
};
