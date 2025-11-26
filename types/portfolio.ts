export interface PortfolioItem {
  type: 'video' | 'image'
  title: string
  role: string
  description: string
  impact: string
  tags: string[]
  mediaPath: string
}

export interface PortfolioSection {
  title: string
  items: PortfolioItem[]
}

export interface PortfolioData {
  sections: PortfolioSection[]
}

