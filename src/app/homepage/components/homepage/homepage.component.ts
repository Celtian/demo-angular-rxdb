import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ROUTES } from 'src/app/shared/constants/route.constant';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { HomepageService } from '../../services/homepage.service';

@UntilDestroy()
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private translate: TranslateService,
    private lr: LocalizeRouterService,
    private language: LanguageService,
    private dataSource: HomepageService // private rxdbProvider: RxdbProvider
  ) {}

  public ngOnInit(): void {
    this.language.language$.pipe(untilDestroyed(this)).subscribe(() => {
      const canonical = this.lr.translateRoute(`/${ROUTES.APP.NOT_FOUND}`) as string;
      this.seoService.setSeo(
        {
          title: this.translate.instant(`SEO.${ROUTES.APP.NOT_FOUND}.title`),
          description: this.translate.instant(`SEO.${ROUTES.APP.NOT_FOUND}.description`),
        },
        canonical
      );
    });

    // this.dataSource.createCollection();
    /*
    const db = this.rxdbProvider.initDB('photo-lib');
    from(db)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const count = this.rxdbProvider.getDatabaseCollection('photos').find();
        console.log(count);
      });
      */

    /*
    setTimeout(() => {
      const count = this.rxdbProvider.getDatabaseCollection('photos').count();
      console.log(count);
    }, 2000);
    */
  }
}
