// AMap.plugin('AMap.Geolocation', function () {
//   var geolocation = new AMap.Geolocation({
//     enableHighAccuracy: true,//是否使用高精度定位，默认:true
//     timeout: 10000,          //超过10秒后停止定位，默认：5s
//     buttonPosition: 'RB',    //定位按钮的停靠位置
//     buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//     // zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
//   });
//   mapObj.addControl(geolocation);
//   setInterval(() => {
//     geolocation.getCurrentPosition(function (status, result) {
//       if (status == 'complete') {
//         onComplete(result)
//       } else {
//         onError(result)
//       }
//     });
//   }, 2000)
// });
// //解析定位结果
// function onComplete(data) {
//   var str = [];
//   str.push('定位结果：' + data.position);
//   str.push('定位类别：' + data.location_type);
//   if (data.accuracy) {
//     str.push('精度：' + data.accuracy + ' 米');
//   }//如为IP精确定位结果则没有精度信息
//   str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
//   console.log('str', str)
// }
// //解析定位错误信息
// function onError(data) {
//   console.log('data.message', data.message)
// }

import { Observable, switchMap, of, BehaviorSubject, Subject, combineLatest, combineLatestAll, debounce, debounceTime  } from 'rxjs';
import { IGeo } from 'src/types';

export function getReGeo(lnglat: AMap.LngLat): Observable<any> {
  return new Observable((observer) => {
    window.Geocoder.getAddress(lnglat, function (status: any, result: any) {
      console.log('status', status);
      console.log('Geocoder.getAddress result: ', result);
      if (status === 'complete' && result.info === 'OK') {
        observer.next(result.regeocode);
        observer.complete();
      } else {
        observer.error(result);
      }
    });
  });
}

export const regeo2IGeo = (lnglat: AMap.LngLat): Observable<IGeo> =>
  getReGeo(lnglat).pipe(
    switchMap((regeocode) => {
      const res: IGeo = {
        address: '',
        fullAddress: '',
        lnglat: {
          longitude: lnglat.getLng(),
          latitude: lnglat.getLat(),
        },
        regeocode,
      };
      if (regeocode.aois && regeocode.aois.length != 0) {
        res.address = regeocode.aois[0].name;
        res.fullAddress = regeocode.formattedAddress;
      } else {
        // console.log('err');
        // throw new Error('无法解析该位置信息');
        res.address = '当前位置';
        res.fullAddress = '';
      }
      return of(res);
    })
  );

  export class regeoGeoModel {
    // 注意这个是私有的, 组件不需要关心这个.
    private regeoNeedsUpdate = new Subject()
    private lnglat = new BehaviorSubject(new AMap.LngLat(113.922869, 22.515923))
    // private lnglat = new BehaviorSubject([113.922869, 22.515923])
    public geo = combineLatest([
      this.lnglat.pipe(debounceTime(2000)),
      this.regeoNeedsUpdate,
    ])
      .pipe(
        switchMap(([lnglat]) => {
          return regeo2IGeo(lnglat)
        })
      )
    public updateLngLat(lnglat: AMap.LngLat) {
      this.lnglat.next(lnglat)
    }
    public refresh() {
      this.regeoNeedsUpdate.next(true);
    }
  }
