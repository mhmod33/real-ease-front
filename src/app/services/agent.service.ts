import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Agent, AgentTypeStats } from '../models/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private agentsSubject = new BehaviorSubject<Agent[]>([
    {
      id: '1',
      name: 'مصعب المنصوري',
      type: 'وكيل عقاري',
      email: 'me653830@gmail.com',
      image: 'images/image-profile.png',
      bannerImage: 'images/Frame 1000002898.png',
      propertiesCount: 243,
      location: 'لبنان،مدينة لبنان الجديدة',
      phone: '+961 70 123 456',
      age: 38,
      gender: 'ذكر',
      address: 'لبنان، مدينة لبنان الجديدة',
      agencyName: 'وكالة المنصوري العقارية',
      agencyAddress: 'لبنان، مدينة لبنان الجديدة',
      agencyDescription:
        'تعد وكالة المنصوري واحدة من الشركات الرائدة في مجال التطوير وتسويق العقارات. تأسست الوكالة بهدف تقديم حلول عقارية مبتكرة وشاملة تلبي احتياجات الأفراد والشركات.',
      agentLicense: '7890 1234 5678 9012',
      taxNumber: 'LB102 345MN OP901',
      stats: {
        total: 243,
        sold: 136,
        rented: 105,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'a1-p1',
          title: 'شقة البحر الأزرق',
          price: '$6521k',
          location: 'الدوحة',
          type: 'للبيع',
          image: 'images/properties/image-1.png',
        },
        {
          id: 'a1-p2',
          title: 'بنتهاوس النجوم',
          price: '$15021k',
          location: 'دبي',
          type: 'للإيجار',
          image: 'images/properties/image-2.png',
        },
      ],
    },
    {
      id: '2',
      name: 'يوسف الكيلاني',
      type: 'وكيل عقاري مستقل',
      email: 'me653830@gmail.com',
      image: 'images/image-person-2.png',
      bannerImage: 'images/Frame 1000002898.png',
      propertiesCount: 413,
      location: 'عمان،مدينة عمان',
      phone: '+962 79 987 654',
      age: 42,
      gender: 'ذكر',
      address: 'عمان، مدينة عمان',
      agencyName: 'الكيلاني للاستشارات العقارية',
      agencyAddress: 'عمان، الدوار السابع',
      agencyDescription:
        'نستثمر في بناء العلاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات استشارية متميزة وفرص استثمارية مثالية.',
      agentLicense: '5678 9012 3456 7890',
      taxNumber: 'JO405 678QR ST123',
      stats: {
        total: 413,
        sold: 210,
        rented: 105,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'a2-p1',
          title: 'فيلا النخبة المميزة',
          price: '$15021k',
          location: 'الرياض',
          type: 'للإيجار',
          image: 'images/properties/image.png',
        },
      ],
    },
    {
      id: '3',
      name: 'سميرة الزلزولي',
      type: 'وكيل تجاري',
      email: 'me653830@gmail.com',
      image: 'images/image-women.png',
      bannerImage: 'images/Frame 1000002898.png',
      propertiesCount: 615,
      location: 'قطر،الدوحة',
      phone: '+974 55 112 233',
      age: 35,
      gender: 'أنثى',
      address: 'قطر، الدوحة',
      agencyName: 'الزلزولي للعقارات التجارية',
      agencyAddress: 'قطر، الخليج الغربي',
      agencyDescription:
        'نحن متخصصون في العقارات التجارية الفاخرة والأبراج والأراضي التجارية بعموم دولة قطر والخليج العربي.',
      agentLicense: '3456 7890 1234 5678',
      taxNumber: 'QA708 901UV WX456',
      stats: {
        total: 615,
        sold: 380,
        rented: 235,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'a3-p1',
          title: 'شقة الحديقة السرية',
          price: '$15021k',
          location: 'القاهرة',
          type: 'للبيع',
          image: 'images/properties/image-4.png',
        },
      ],
    },
    {
      id: '4',
      name: 'شركة السعداء',
      type: 'شركة عقارية',
      email: 'me653830@gmail.com',
      image: 'images/image-company.png',
      bannerImage: 'images/Frame 1000002898.png',
      propertiesCount: 970,
      location: 'الإمارات،دبي',
      phone: '+971 4 333 4444',
      age: 50,
      gender: 'ذكر',
      address: 'الإمارات، دبي، مارينا',
      agencyName: 'شركة السعداء العقارية',
      agencyAddress: 'الإمارات، دبي',
      agencyDescription:
        'تعد شركة السعداء العقارية واحدة من الشركات الرائدة في مجال تطوير وتسويق العقارات. تأسست الشركة بهدف تقديم حلول عقارية مبتكرة وشاملة تلبي احتياجات الأفراد والشركات. تتميز الشركة بمحفظة متنوعة تضم الوحدات السكنية الفاخرة.',
      agentLicense: '1234 5678 9101 1238',
      taxNumber: 'TN305 985PL PQ856',
      stats: {
        total: 970,
        sold: 580,
        rented: 390,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
    },
    {
      id: '5',
      name: 'عبد العزيز النصر',
      type: 'وكيل عقاري',
      email: 'me652gmail.com',
      image: 'images/image 7.png',
      bannerImage: 'images/Frame 1000002898.png',
      propertiesCount: 970,
      location: 'عمان،مدينة عمان',
      phone: '+962 79 111 2233',
      age: 45,
      gender: 'ذكر',
      address: 'عمان،مدينة عمان',
      agencyName: 'شركة السعداء',
      agencyAddress: 'الإمارات، دبي',
      agencyDescription:
        'تعد شركة السعداء العقارية واحدة من الشركات الرائدة في مجال تطوير وتسويق العقارات. تأسست الشركة بهدف تقديم حلول عقارية مبتكرة وشاملة تلبي احتياجات الأفراد والشركات. تتميز الشركة بمحفظة متنوعة تضم الوحدات السكنية الفاخرة. تضع شركة الأفق العقارية أعلى معايير الجودة والشفافية في جميع التعاملاتها، كما تسعى إلى بناء علاقات طويلة الأمد مع عملائها من خلال تقديم خدمات استشارية متميزة. إذا كنت تبحث عن منزل أحلامك أو الفرصة الاستثمارية المثالية، فإن شركة الأفق العقارية هي الوجهة المثالية لتحقيق طموحاتك.',
      agentLicense: '1234 5678 9101 1238',
      taxNumber: 'TN305 985PL PQ856',
      stats: {
        total: 243,
        sold: 136,
        rented: 105,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'a5-p1',
          title: 'بنتهاوس راقٍ',
          price: '$4521k',
          location: 'دبي',
          type: 'للبيع',
          image: 'images/image-1.png',
        },
        {
          id: 'a5-p2',
          title: 'فيلا النخبة المميزة',
          price: '$15021k',
          location: 'الرياض',
          type: 'للإيجار',
          image: 'images/image-2.png',
        },
      ],
    },
  ]);

  agents$ = this.agentsSubject.asObservable();

  getAgents(): Agent[] {
    return this.agentsSubject.value;
  }

  getAgentById(id: string): Agent | undefined {
    return this.agentsSubject.value.find((a) => a.id === id);
  }

  getAgentTypeStats(): AgentTypeStats {
    return {
      realEstateCompanyCount: 50,
      independentAgentCount: 50,
      exclusiveAgentCount: 30,
      commercialAgentCount: 20,
      total: 150,
    };
  }

  addAgent(newAgentData: Partial<Agent>): Observable<Agent> {
    const current = this.agentsSubject.value;
    const newAgent: Agent = {
      id: String(Date.now()),
      name: newAgentData.name || 'وكيل جديد',
      type: newAgentData.type || 'وكيل عقاري مستقل',
      email: newAgentData.email || 'agent@realease.com',
      image: newAgentData.image || 'images/image 6.png',
      propertiesCount: newAgentData.propertiesCount || 0,
      location: newAgentData.location || newAgentData.address || 'العنوان غير محدد',
      age: newAgentData.age,
      gender: newAgentData.gender,
      address: newAgentData.address,
      agencyName: newAgentData.agencyName || 'وكالة جديدة',
      agencyAddress: newAgentData.agencyAddress,
      agencyDescription: newAgentData.agencyDescription,
      agentLicense: newAgentData.agentLicense || '1234 5678 9101 1238',
      taxNumber: newAgentData.taxNumber || 'TN305 985PL PQ856',
      stats: {
        total: 0,
        sold: 0,
        rented: 0,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
    };

    this.agentsSubject.next([newAgent, ...current]);
    return of(newAgent);
  }

  deleteAgent(id: string): Observable<boolean> {
    const filtered = this.agentsSubject.value.filter((a) => a.id !== id);
    this.agentsSubject.next(filtered);
    return of(true);
  }

  deleteAgentProperty(agentId: string, propertyId: string): Observable<boolean> {
    const agent = this.agentsSubject.value.find((a) => a.id === agentId);
    if (agent?.properties) {
      agent.properties = agent.properties.filter((p) => p.id !== propertyId);
      this.agentsSubject.next([...this.agentsSubject.value]);
    }
    return of(true);
  }
}
