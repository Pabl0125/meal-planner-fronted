import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

/**
 * Captures an HTML element and triggers a download as a PDF
 */
export async function exportElementAsPDF(elementId: string, filename: string = "meal-plan.pdf") {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id ${elementId} not found`)
    return
  }

  try {
    // We add some padding/scaling to ensure it looks good
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#fbf9f6'
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // A4 dimensions at 72 dpi are 595 x 842
    const pdf = new jsPDF({
      orientation: 'landscape', // landscape is better for a 7-day grid
      unit: 'px',
      format: [canvas.width, canvas.height]
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(filename)
  } catch (error) {
    console.error("Error exporting PDF:", error)
  }
}
