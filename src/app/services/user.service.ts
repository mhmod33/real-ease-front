import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([
    {
      id: '1',
      name: 'اسلام ابو مصعب',
      type: 'وكيل عقاري مستقل',
      email: 'me653830@gmail.com',
      image: 'images/image 7.png',
      bannerImage: 'images/image-1.png',
      propertiesCount: 413,

      role:'admin',
      location: 'عمان،مدينة عمان',
      phone: '+962 79 123 4567',
      whatsapp: '+962 79 123 4567',
      website: 'www.islam-realestate.com',
      age: 40,
      gender: 'ذكر',
      address: 'عمان، مدينة عمان',
      agencyName: 'مؤسسة إسلام للاستشارات',
      agencyAddress: 'عمان، شارع مكة',
      description:
        'مستشار عقاري متخصص بخبرة تفوق 10 سنوات في تقديم أفضل الحلول الاستثمارية والسكنية بالمملكة الأردنية والخليج العربي.',
      experienceYears: 10,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'p1',
          title: 'بنتهاوس راقٍ',
          price: '$4521k',
          location: 'دبي',
          type: 'للبيع',
          image: 'images/image-1.png',
        },
        {
          id: 'p2',
          title: 'فيلا النخبة المميزة',
          price: '$15021k',
          location: 'الرياض',
          type: 'للإيجار',
          image: 'images/image-2.png',
        },
      ],
    },
    {
      id: '2',
      name: 'عز الدين ابو عابد',
      type: 'وكيل عقاري',
      email: 'me653830@gmail.com',
      image: 'images/image 6.png',
      role:'admin',
      bannerImage: 'images/image-2.png',
      propertiesCount: 350,
      location: 'لبنان،مدينة لبنان الجديدة',
      phone: '+961 70 888 999',
      whatsapp: '+961 70 888 999',
      website: 'www.ezzeddine.com',
      age: 38,
      gender: 'ذكر',
      address: 'لبنان، مدينة لبنان الجديدة',
      agencyName: 'وكالة أبو عابد العقارية',
      agencyAddress: 'لبنان، بيروت',
      description:
        'وكيل عقاري معتمد متخصص في تسويق وتطوير العقارات السكنية الفاخرة والأبراج في لبنان والشرق الأوسط.',
      experienceYears: 7,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'p3',
          title: 'شقة فاخرة على البحر',
          price: '$3200k',
          location: 'بيروت',
          type: 'للبيع',
          image: 'images/image-3.png',
        },
      ],
    },
    {
      id: '3',
      name: 'شركة الافق العقارية',
      type: 'شركة عقارية',
      email: 'me653830@gmail.com',
      image: 'images/image 11.png',
      bannerImage: 'images/image.png',
      propertiesCount: 970,
      location: 'الإمارات،دبي',
      phone: '+971 4 555 6666',
      whatsapp: '+971 50 555 6666',
      website: 'www.alofoq-realestate.ae',
      age: 45,
      role:'admin',
      gender: 'ذكر',
      address: 'الإمارات، دبي',
      agencyName: 'شركة الأفق العقارية',
      agencyAddress: 'الإمارات، دبي، داون تاون',
      description:
        'تعد شركة الأفق العقارية من الشركات الرائدة في تطوير العقارات الفاخرة وإدارة المحافظ العقارية الكبرى.',
      experienceYears: 15,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
    },
    {
      id: '4',
      name: 'ولاء السالمي',
      type: 'وكيل عقاري',
      email: 'me653830@gmail.com',
      image: 'images/image 5.png',
      bannerImage: 'images/image-3.png',
      propertiesCount: 615,
      location: 'قطر،الدوحة',
      phone: '+974 44 222 333',
      whatsapp: '+974 55 222 333',
      website: 'www.walaa-alsalmi.com',
      age: 33,
      gender: 'أنثى',
      role:'admin',
      address: 'قطر، الدوحة',
      agencyName: 'السالمي للتجارة والعقارات',
      agencyAddress: 'قطر، الدوحة',
      description:
      'وكيل تجاري متميز في تسويق المجمعات التجارية والمحلات الاستثمارية بدولة قطر.',
      experienceYears: 6,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
    },
    {
      id: '5',
      name: 'عبد العزيز النصر',
      role:'admin',
      type: 'وكيل عقاري',
      email: 'me652@gmail.com',
      image: 'images/image 7.png',
      bannerImage: 'images/image-1.png',
      propertiesCount: 970,
      location: 'عمان،مدينة عمان',
      phone: '(+12) 1254-56-4896',
      whatsapp: '(+12) 1254-56-4896',
      website: 'www.abdulaziz.com',
      age: 35,
      gender: 'ذكر',
      address: 'عمان،مدينة عمان',
      agencyName: 'شركة الأفق',
      agencyAddress: 'عمان، مدينة عمان',
      description:
        'أنا مدير عقاري محترف ومتخصص في تقديم حلول عقارية متكاملة تلبي احتياجات العملاء سواء كانوا أفراداً أو شركات. أعمل على توفير مجموعة واسعة من الخيارات العقارية، بما في ذلك الوحدات السكنية الفاخرة والأراضي الاستثمارية المثالية. أسعى دائماً إلى تقديم خدمة متميزة واستشارات مهنية لمساعدة العملاء في الحصول على منزل أحلامهم أو تحقيق أهدافهم الاستثمارية بكل سهولة ويسر.',
      experienceYears: 8,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [
        {
          id: 'p1',
          title: 'بنتهاوس راقٍ',
          price: '$4521k',
          location: 'دبي',
          type: 'للبيع',
          image: 'images/image-1.png',
        },
        {
          id: 'p2',
          title: 'فيلا النخبة المميزة',
          price: '$15021k',
          location: 'الرياض',
          type: 'للإيجار',
          image: 'images/image-2.png',
        },
      ],
    },
  ]);

  users$ = this.usersSubject.asObservable();

  getUsers(): User[] {
    return this.usersSubject.value;
  }

  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find((u) => u.id === id);
  }

  createUser(userData: Partial<User>): Observable<User> {
    const current = this.usersSubject.value;
    const newUser: User = {
      id: String(Date.now()),
      name: userData.name || 'مستخدم جديد',
      type: userData.type || 'وكيل عقاري',
      email: userData.email || 'user@realease.com',
      image: userData.image || 'images/image 6.png',
      propertiesCount: 0,
      location: userData.location || userData.address || 'العنوان غير محدد',
      age: userData.age,
      role: userData.role || 'user',
      gender: userData.gender,
      address: userData.address,
      agencyName: userData.agencyName || 'وكالة جديدة',
      agencyAddress: userData.agencyAddress,
      description: userData.description,
      experienceYears: 1,
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
      },
      properties: [],
    };

    this.usersSubject.next([newUser, ...current]);
    return of(newUser);
  }

  deleteUser(id: string): Observable<boolean> {
    const filtered = this.usersSubject.value.filter((u) => u.id !== id);
    this.usersSubject.next(filtered);
    return of(true);
  }

  deleteSelectedUsers(ids: string[]): Observable<boolean> {
    const filtered = this.usersSubject.value.filter((u) => !ids.includes(u.id));
    this.usersSubject.next(filtered);
    return of(true);
  }

  updateUser(id: string, updatedData: Partial<User>): Observable<User | undefined> {
    const current = this.usersSubject.value;
    const index = current.findIndex((u) => u.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updatedData };
      this.usersSubject.next([...current]);
      return of(current[index]);
    }
    return of(undefined);
  }
}
