import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // ماتنساش الـ import

// 1. التعريف (Interface)
export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: "adhesives" | "waterproofing" | "sealants" | "grouts";
  price: number;
  weight: string;
  description: string;
  specs: Record<string, string>;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  hasOffer?: boolean;
  oldPrice?: number;
}

export interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  // 2. البيانات (Data)
  categories: Category[] = [
    { id: "all", name: "جميع المنتجات" },
    { id: "adhesives", name: "لواصق البلاط" },
    { id: "waterproofing", name: "أنظمة العزل المائي" },
    { id: "sealants", name: "موانع التسرب" },
    { id: "grouts", name: "الترويبة (الجراوت)" }
  ];

  allProducts: Product[] = [
    {
      id: "pf-pool-tech-c2ftes2",
      nameAr: "بلاتينيوم فيكس بول تك C2FTES2",
      nameEn: "Platinum Fix Pool Tech C2FTES2",
      category: "adhesives",
      price: 12.500,
      weight: "20 كجم",
      description: "لاصق بلاط عالي الأداء مصمم خصيصاً لحمامات السباحة والمناطق المغمورة بالمياه.",
      specs: { "المعيار": "C2FTE S2", "التغطية": "3-5 كجم / م٢" },
      image: "assets/images/product-1.png",
      isBestSeller: true
    },
    {
      id: "pf-high-tech-2k",
      nameAr: "بلاتينيوم فيكس هاي تك 2K",
      nameEn: "Platinum Fix High Tech 2K",
      category: "waterproofing",
      price: 18.000,
      weight: "20 كجم + 10 لتر",
      description: "عازل مائي أسمنتي مرن ثنائي المركب، يستخدم لعزل الأسطح والخزانات.",
      specs: { "المرونة": "عالية جداً", "الجفاف": "3 ساعات" },
      image: "assets/images/product-3.png",
      hasOffer: true,
      oldPrice: 22.000
    },
    {
      id: "pf-pro-c2ftes1",
      nameAr: "بلاتينيوم فيكس بروفيشينال C2FTES1",
      nameEn: "Platinum Fix Professional C2FTES1",
      category: "adhesives",
      price: 8.500,
      weight: "20 كجم",
      description: "لاصق بلاط مرن وعالي الجودة للبورسلين والسيراميك والرخام.",
      specs: { "المعيار": "C2FTE S1", "الجفاف": "24 ساعة" },
      image: "assets/images/product-2.png"
    },
    {
      id: "pf-seal-pu",
      nameAr: "سيليكون بولي يوريثان المعماري",
      nameEn: "PU Architectural Sealant",
      category: "sealants",
      price: 3.250,
      weight: "600 مل",
      description: "مانع تسرب بولي يوريثان مرن عالي الجودة لفواصل التمدد الإنشائية.",
      specs: { "الأساس": "بولي يوريثان", "الحركة": "±25%" },
      image: "assets/images/product-4.png",
      isNew: true
    },
    {
      id: "pf-epoxy-grout",
      nameAr: "ترويبة إيبوكسي مقاومة للأحماض",
      nameEn: "Acid Resistant Epoxy Grout",
      category: "grouts",
      price: 24.000,
      weight: "5 كجم",
      description: "ترويبة لاصقة إيبوكسية للمستشفيات والمصانع والمسابح.",
      specs: { "المقاومة": "عالية جداً", "الفاصل": "2-15 مم" },
      image: "assets/images/product-1.png"
    },
    {
      id: "pf-flex-c2te",
      nameAr: "بلاتينيوم فيكس فليكس C2TE",
      nameEn: "Platinum Fix Flex C2TE",
      category: "adhesives",
      price: 6.750,
      weight: "20 كجم",
      description: "لاصق بورسلين محسن بأساس أسمنتي مانع للانزلاق.",
      specs: { "المعيار": "C2TE", "التغطية": "4-5 كجم / م٢" },
      image: "assets/images/product-2.png"
    },
    {
      id: "pf-acrylic-waterproof",
      nameAr: "عازل مائي أكريليك",
      nameEn: "Acrylic Waterproofing",
      category: "waterproofing",
      price: 14.500,
      weight: "20 كجم",
      description: "طلاء مطاطي عازل للمياه بأساس أكريليك للأسطح المكشوفة.",
      specs: { "الاستطالة": ">300%", "الجفاف": "4 ساعات" },
      image: "assets/images/product-3.png",
      isBestSeller: true
    },
    {
      id: "pf-silicone-sanitary",
      nameAr: "سيليكون صحي مضاد للبكتيريا",
      nameEn: "Sanitary Anti-fungal Silicone",
      category: "sealants",
      price: 2.500,
      weight: "280 مل",
      description: "مانع تسرب سيليكوني ممتاز للحمامات والمطابخ.",
      specs: { "الأساس": "سيليكون أسيتيك", "مقاومة العفن": "ممتازة" },
      image: "assets/images/product-4.png"
    }
  ];

  // 3. متغيرات التحكم (State)
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  showOffers: boolean = false;

constructor(
    private route: ActivatedRoute,
    private router: Router // ضيف الـ Router هنا
  ) {}

  ngOnInit(): void {
    // مراقبة الـ Query Params للفلترة التلقائية عند الدخول للصفحة
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || 'all';
      this.showOffers = params['filter'] === 'offers';
      this.applyFilters();
    });
  }

  // 4. الدوال (Logic)
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchSearch = p.nameAr.includes(this.searchQuery) ||
                          p.nameEn.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchOffers = this.showOffers ? p.hasOffer : true;

      return matchCategory && matchSearch && matchOffers;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.showOffers = false;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    console.log('تمت الإضافة للسلة:', product.nameAr);
    // منطق إضافة المنتج للسلة يوضع هنا
  }


goToDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

}
