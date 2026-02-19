import { Component } from '@angular/core';

@Component({
  selector: 'ui-heading1',
  template: `<h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white gap-x-2"><ng-content></ng-content></h1>`
})
export class Heading1Component {}

@Component({
  selector: 'ui-heading2',
  template: `<h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white gap-x-2"><ng-content></ng-content></h2>`
})
export class Heading2Component {}

@Component({
  selector: 'ui-heading3',
  template: `<h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white gap-x-2"><ng-content></ng-content></h3>`
})
export class Heading3Component {}

@Component({
  selector: 'ui-heading4',
  template: `<h4 class="text-base md:text-lg font-medium text-gray-900 dark:text-white gap-x-2"><ng-content></ng-content></h4>`
})
export class Heading4Component {}

@Component({
  selector: 'ui-section-heading',
  template: `<h3 class="text-base md:text-lg font-medium text-gray-900 dark:text-white gap-x-2 flex items-center mb-2"><ng-content></ng-content></h3>`
})
export class SectionHeadingComponent {} 

@Component({
  selector: 'ui-subtitle',
  template: `<p class="text-gray-600 dark:text-gray-400 text-base md:text-lg"><ng-content></ng-content></p>`
})
export class SubtitleComponent {}

@Component({
  selector: 'ui-text',
  template: `<p class="text-sm text-gray-500 dark:text-gray-400"><ng-content></ng-content></p>`
})
export class TextComponent {}
